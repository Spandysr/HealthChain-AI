import Twilio from 'twilio';
import { predictionService } from './predictionService';
import { pool } from '../database/db';

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppMessage = async (to: string, body: string): Promise<void> => {
    try {
        await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: to,
            body: body,
        });
        await pool.query('INSERT INTO whatsapp_messages SET ?', [{ to_number: to, message_body: body, direction: 'outbound' }]);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

const generateResponseMessage = (prediction: any): string => {
    const { recommendations, patientSummary, diabetes, cardiovascularDisease, chronicKidneyDisease } = prediction;

    let riskLevel = "Low";
    if (diabetes.risk === 'High' || cardiovascularDisease.risk === 'High' || chronicKidneyDisease.risk === 'High') {
        riskLevel = "High";
    }
    if (diabetes.risk === 'Critical' || cardiovascularDisease.risk === 'Critical' || chronicKidneyDisease.risk === 'Critical') {
        riskLevel = "Critical";
    }

    let response = `*HealthChain-AI Analysis*

*Summary:* ${patientSummary}

*Risk Interpretation:* Your overall risk level is estimated to be *${riskLevel}*.
- Diabetes Risk: ${diabetes.risk} (${(diabetes.probability * 100).toFixed(1)}%)
- Cardiovascular Disease Risk: ${cardiovascularDisease.risk} (${(cardiovascularDisease.probability * 100).toFixed(1)}%)
- Chronic Kidney Disease Risk: ${chronicKidneyDisease.risk} (${(chronicKidneyDisease.probability * 100).toFixed(1)}%)

*Doctor Visit Recommendation:* ${recommendations.doctorVisit}

*Dietary Guidance:* ${recommendations.dietaryAdvice}

*Next Steps:* ${recommendations.nextActions}
`;

    if (riskLevel === 'High' || riskLevel === 'Critical') {
        response += `
*IMPORTANT:* Your results indicate a high or critical risk. It is strongly recommended that you consult a medical professional as soon as possible.`;
    }

    response += `
---
*Disclaimer:* This is an AI-generated analysis and not a medical diagnosis. Please consult with a qualified healthcare provider for any health concerns.`;

    return response;
};

export const whatsappService = {
    handleIncomingMessage: async (message: any): Promise<void> => {
        const from = message.From;
        const body = message.Body;

        await pool.query('INSERT INTO whatsapp_messages SET ?', [{ from_number: from, message_body: body, direction: 'inbound' }]);

        // This is a simplified parsing logic. In a real-world scenario,
        // you would parse the diagnosis report more robustly.
        // Here we assume the message contains patient data in a specific format.
        try {
            const patientData = JSON.parse(body);
            const prediction = await predictionService.createPrediction(patientData);
            const responseMessage = generateResponseMessage(prediction);
            await sendWhatsAppMessage(from, responseMessage);
        } catch (error) {
            console.error("Could not parse patient data from WhatsApp message", error);
            await sendWhatsAppMessage(from, "I'm sorry, I couldn't understand the report format. Please provide the patient data in a valid JSON format.");
        }
    },

    sendPredictionSummary: async (to: string, predictionId: number): Promise<void> => {
        const prediction = await predictionService.getPredictionById(predictionId);
        if (!prediction) {
            throw new Error('Prediction not found');
        }
        const responseMessage = generateResponseMessage(prediction);
        await sendWhatsAppMessage(to, responseMessage);
    },

    sendMessage: async (to: string, body: string): Promise<void> => {
        await sendWhatsAppMessage(to, body);
    }
};
