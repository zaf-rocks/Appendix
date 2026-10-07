const KEY = "appendix-file-draft";

export type FileDraft = { name: string; url: string; line: string };

export function saveFileDraft(draft: FileDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* private mode */
  }
}

export function peekFileDraft() {
  try {
    return Boolean(sessionStorage.getItem(KEY));
  } catch {
    return false;
  }
}

export function takeFileDraft(): FileDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const d = JSON.parse(raw) as Partial<FileDraft>;
    return {
      name: typeof d.name === "string" ? d.name : "",
      url: typeof d.url === "string" ? d.url : "",
      line: typeof d.line === "string" ? d.line : "",
    };
  } catch {
    return null;
  }
}
