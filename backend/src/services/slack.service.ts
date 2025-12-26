import axios from "axios";

export async function notifySlack(message: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return;

  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
  } catch (err) {
    console.error("Failed to send Slack notification", err);
  }
}
