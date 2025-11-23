import { A as AWS } from "./assets/aws-DbqHRm5C.js";
import "zod";
import "./assets/resource.cloudflare-Mzu_X_uv.js";
import "cloudflare:workers";
import "aws4fetch";
import "./assets/fn-DkMgaEh2.js";
async function POST(event) {
  try {
    const body = await event.request.json();
    if (!body.name || !body.role || !body.email || !body.message) {
      return Response.json({
        error: "All fields are required"
      }, {
        status: 400
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return Response.json({
        error: "Invalid email format"
      }, {
        status: 400
      });
    }
    const emailContent = `
${body.message}<br><br>
--<br>
${body.name}<br>
${body.role}<br>
${body.email}`.trim();
    await AWS.sendEmail({
      to: "contact@anoma.ly",
      subject: `Enterprise Inquiry from ${body.name}`,
      body: emailContent
    });
    return Response.json({
      success: true,
      message: "Form submitted successfully"
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error processing enterprise form:", error);
    return Response.json({
      error: "Internal server error"
    }, {
      status: 500
    });
  }
}
export {
  POST
};
