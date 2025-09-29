import { createSlice, nanoid } from "@reduxjs/toolkit";

const candidatesSlice = createSlice({
  name: "candidates",
  initialState: {
    list: [],
  },
  reducers: {
    upsertCandidate: (state, action) => {
      const c = action.payload;
      const idx = state.list.findIndex((x) => x.id === c.id);
      if (idx >= 0) state.list[idx] = c;
      else state.list.push({ id: nanoid(), ...c });
    },
    clearAllCandidates: (state) => {
      state.list = [];
    },
  },
});

export const { upsertCandidate, clearAllCandidates } = candidatesSlice.actions;
export const selectCandidates = (s) => {
  const list = [...s.candidates.list];
  list.sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
  return list;
};
export default candidatesSlice.reducer;
