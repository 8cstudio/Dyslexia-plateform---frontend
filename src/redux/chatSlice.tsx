import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  chats: [],
  isPending: false,
  isError: false,
  isSuccess: false,
};

const token = localStorage.getItem("token");

// Async thunk to fetch chats
export const getChats = createAsyncThunk(
  "chat/getChats",
  async ({}, thunkAPI) => {
    try {
      const resp = await axios.get("/chat/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.data; // Return chats data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to create a chat
export const createChat = createAsyncThunk(
  "chat/createChat",
  async (chatData: { groupName: string; participants: any[] }, thunkAPI) => {
    try {
      const response = await axios.post("/api/chats", chatData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return new chat data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to delete a chat
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: string, thunkAPI) => {
    try {
      await axios.delete(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return chatId; // Return the chatId to remove from the list
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle getChats
      .addCase(getChats.pending, (state) => {
        state.isPending = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.chats = action.payload; // Set chats list
      })
      .addCase(getChats.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        console.error(action.payload); // Log error or display error message
      })

      // Handle createChat
      .addCase(createChat.pending, (state) => {
        state.isPending = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.chats.push(action.payload); // Add new chat to the list
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        console.error(action.payload); // Log error or display error message
      })

      // Handle deleteChat
      .addCase(deleteChat.pending, (state) => {
        state.isPending = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isPending = false;
        state.isSuccess = true;
        state.chats = state.chats.filter((chat) => chat._id !== action.payload); // Remove deleted chat
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        console.error(action.payload); // Log error or display error message
      });
  },
});

export default chatSlice.reducer;
