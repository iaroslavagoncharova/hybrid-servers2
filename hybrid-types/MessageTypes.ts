import { Comment, Post, UnauthorizedUser, User, UserHabits } from "./DBTypes";

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UnauthorizedUser;
};

type UserResponse = MessageResponse & {
  user: UnauthorizedUser;
};

type UserDeleteResponse = MessageResponse & {
  user: {
    user_id: number;
  };
};

type HabitResponse = MessageResponse & {
  habit: UserHabits;
};

type FrequencyResponse = MessageResponse & {
  habit_frequency: string;
};

type PostResponse = MessageResponse & {
  post: Post;
};

type CommentResponse = MessageResponse & {
  comment: Comment;
};

type UploadResult = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  LoginResponse,
  UserResponse,
  UserDeleteResponse,
  HabitResponse,
  FrequencyResponse,
  PostResponse,
  CommentResponse,
  UploadResult
};
