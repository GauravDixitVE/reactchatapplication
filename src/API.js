export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmOTA1MzI3YS0yOTRiLTRkNTItYWMzMS04ZjhmZDY4ZjVhYTUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY1OTAxMzYwNiwiZXhwIjoxNjU5NjE4NDA2fQ.qhSzFxmOjrqG-1rMvoCP8qicL04GayyMMZf2SYv64vg";
// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v1/meetings`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ region: "sg001" }),
  });

  const { meetingId } = await res.json();
  return meetingId;
};