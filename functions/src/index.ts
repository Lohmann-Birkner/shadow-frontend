/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";

exports.secret = onRequest(
    { secrets: ["NEXTAUTH_SECRET"] },
    (request, response) => {
        response.status(200).send(
            JSON.stringify({
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            })
        );
    }
);
