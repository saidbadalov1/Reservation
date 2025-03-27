import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModalType {
  SPECIALTY = "specialtyModal",
  SORT = "sortModal",
}

export interface ModalState {
  [ModalType.SPECIALTY]: boolean;
  [ModalType.SORT]: boolean;
}

const initialState: ModalState = {
  [ModalType.SPECIALTY]: false,
  [ModalType.SORT]: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      // Close all modals
      Object.keys(state).forEach((key) => {
        state[key as keyof ModalState] = false;
      });
      // Open the requested modal
      state[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<ModalType>) => {
      state[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state).forEach((key) => {
        state[key as keyof ModalState] = false;
      });
    },
  },
});

export const { openModal, closeModal, closeAllModals } = modalSlice.actions;

export default modalSlice.reducer;
