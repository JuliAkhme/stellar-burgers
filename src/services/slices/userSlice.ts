import {
  getUserApi,
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected
} from '@reduxjs/toolkit';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../store';

export const sliceName = 'user';

const enum StatusRequest {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

export type TUserData = {
  email: string;
  name: string;
};

export interface TUserState {
  isAuthenticated: boolean;
  data: TUserData | null;
  loginUserRequest: StatusRequest;
  loginUserError?: string | null | undefined;
}

const initialState: TUserState = {
  isAuthenticated: false,
  data: null,
  loginUserRequest: StatusRequest.Idle,
  loginUserError: null
};

export const checkUserAuth = createAsyncThunk(
  `${sliceName}/checkUserAuth`,
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((response) => {
          dispatch(checkUser(response.user));
        })
        .finally(() => {
          dispatch(authCheck());
        });
    } else {
      dispatch(authCheck());
    }
  }
);

export const registerUser = createAsyncThunk<TUserData, TRegisterData>(
  `${sliceName}/registerUser`,
  async (dataUser, { rejectWithValue }) => {
    const data = await registerUserApi(dataUser);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk<TUserData, TLoginData>(
  `${sliceName}/loginUser`,
  async (dataUser, { rejectWithValue }) => {
    const data = await loginUserApi(dataUser);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk<TUserData, Partial<TUserData>>(
  `${sliceName}/updateUser`,
  async (userData) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  `${sliceName}/logoutUser`,
  async (_, { dispatch }) => {
    await logoutApi().then(() => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
    });
  }
);

export const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    checkUser: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.loginUserRequest = StatusRequest.Success;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = StatusRequest.Success;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = StatusRequest.Success;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = null;
        state.loginUserRequest = StatusRequest.Idle;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = StatusRequest.Success;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loginUserRequest = StatusRequest.Failed;
      })
      .addMatcher(isPending, (state) => {
        state.loginUserRequest = StatusRequest.Loading;
      })
      .addMatcher(isRejected, (state) => {
        state.loginUserRequest = StatusRequest.Failed;
      });
  }
});

export const { authCheck, logout, checkUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const getUser = (state: RootState) => state.user.data;
export const getIsAuthChecked = (state: RootState) =>
  state.user.loginUserRequest !== StatusRequest.Idle;
export const getRegisteredUser = (state: RootState) => state.user.data;
export const getLoggedInUser = (state: RootState) => {
  const user = state.user.data;
  const isAuthenticated = state.user.isAuthenticated;

  return isAuthenticated ? user : null;
};
