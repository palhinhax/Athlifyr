import {
  formatPushPart,
  formatEmailPart,
  buildToastParts,
} from "@/components/admin/admin-push-notification-dialog";

describe("formatPushPart", () => {
  it("returns singular device for single audience with 1 sent", () => {
    expect(
      formatPushPart(
        { usersTargeted: 1, tokensFound: 1, sent: 1, failed: 0 },
        "single"
      )
    ).toBe("Push: 1 dispositivo");
  });

  it("returns plural devices for single audience with many sent", () => {
    expect(
      formatPushPart(
        { usersTargeted: 1, tokensFound: 3, sent: 3, failed: 0 },
        "single"
      )
    ).toBe("Push: 3 dispositivos");
  });

  it("returns singular user for broadcast with 1 targeted", () => {
    expect(
      formatPushPart(
        { usersTargeted: 1, tokensFound: 2, sent: 2, failed: 0 },
        "broadcast"
      )
    ).toBe("Push: 1 utilizador");
  });

  it("returns plural users for broadcast with many targeted", () => {
    expect(
      formatPushPart(
        { usersTargeted: 5, tokensFound: 10, sent: 8, failed: 2 },
        "broadcast"
      )
    ).toBe("Push: 5 utilizadores");
  });
});

describe("formatEmailPart", () => {
  it("returns singular text for single audience", () => {
    expect(formatEmailPart({ sent: true }, "single")).toBe("Email enviado");
  });

  it("returns plural count for broadcast with emailsSent", () => {
    const result = { sent: true, emailsSent: 3 } as { sent: true } & {
      emailsSent?: number;
    };
    expect(formatEmailPart(result, "broadcast")).toBe("Emails: 3 enviados");
  });

  it("returns singular count for broadcast with 1 emailsSent", () => {
    const result = { sent: true, emailsSent: 1 } as { sent: true } & {
      emailsSent?: number;
    };
    expect(formatEmailPart(result, "broadcast")).toBe("Emails: 1 enviado");
  });

  it("returns 0 for broadcast without emailsSent property", () => {
    expect(formatEmailPart({ sent: true }, "broadcast")).toBe(
      "Emails: 0 enviados"
    );
  });
});

describe("buildToastParts", () => {
  it("returns empty array when no results", () => {
    expect(buildToastParts(null, null, "single")).toEqual([]);
  });

  it("includes push part when sent > 0", () => {
    const push = { usersTargeted: 1, tokensFound: 1, sent: 1, failed: 0 };
    const parts = buildToastParts(push, null, "single");
    expect(parts).toEqual(["Push: 1 dispositivo"]);
  });

  it("excludes push when sent is 0", () => {
    const push = { usersTargeted: 1, tokensFound: 0, sent: 0, failed: 0 };
    expect(buildToastParts(push, null, "single")).toEqual([]);
  });

  it("includes email part when sent is true", () => {
    const email = { sent: true };
    const parts = buildToastParts(null, email, "single");
    expect(parts).toEqual(["Email enviado"]);
  });

  it("excludes email when sent is false", () => {
    const email = { sent: false, error: "fail" };
    expect(buildToastParts(null, email, "single")).toEqual([]);
  });

  it("returns both parts when both succeed", () => {
    const push = { usersTargeted: 10, tokensFound: 20, sent: 18, failed: 2 };
    const email = { sent: true, emailsSent: 8 } as { sent: true } & {
      emailsSent?: number;
    };
    const parts = buildToastParts(push, email, "broadcast");
    expect(parts).toEqual(["Push: 10 utilizadores", "Emails: 8 enviados"]);
  });
});
