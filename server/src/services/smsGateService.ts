import { env } from "../config/env.js";

export interface SmsGateClient {
  sendOtpSms(phoneNumber: string, otp: string): Promise<void>;
}

class MockSmsGateClient implements SmsGateClient {
  async sendOtpSms(phoneNumber: string, otp: string): Promise<void> {
    // No real SMSGATE credentials configured yet — log instead of sending.
    console.log(`[smsGate:mock] OTP for ${phoneNumber}: ${otp}`);
  }
}

// The global `fetch`/`Response` types Node ships (via @types/node's bundled undici
// types) resolve inconsistently depending on the exact TS lib combination in play —
// this minimal shape sidesteps that entirely; `fetch()` genuinely returns this at runtime.
interface FetchResponseLike {
  ok: boolean;
  status: number;
  text(): Promise<string>;
}

// TODO: replace request shape once real SMSGATE API docs/credentials are provided.
class HttpSmsGateClient implements SmsGateClient {
  constructor(
    private readonly baseUrl: string,
    private readonly username: string,
    private readonly password: string,
    private readonly deviceId: string,
  ) {}

  async sendOtpSms(phoneNumber: string, otp: string): Promise<void> {
    const authHeader = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`;
    const res = (await fetch(`${this.baseUrl}/3rdparty/v1/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        phoneNumbers: [phoneNumber],
        message: `Your InnoVote 2.0 verification code is ${otp}. It expires in 3 minutes.`,
        ...(this.deviceId ? { deviceId: this.deviceId } : {}),
      }),
    })) as unknown as FetchResponseLike;

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`SMSGATE request failed (${res.status}): ${body}`);
    }
  }
}

export const smsGateClient: SmsGateClient =
  env.SMSGATE_BASE_URL && env.SMSGATE_USERNAME && env.SMSGATE_PASSWORD
    ? new HttpSmsGateClient(env.SMSGATE_BASE_URL, env.SMSGATE_USERNAME, env.SMSGATE_PASSWORD, env.SMSGATE_DEVICE_ID)
    : new MockSmsGateClient();
