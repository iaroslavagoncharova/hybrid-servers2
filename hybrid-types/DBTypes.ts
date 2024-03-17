type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  created_at: Date | string;
  habit_id: number;
  habit_frequency: string;
  habit_name?: string;
};

type UnauthorizedUser = Omit<User, "password">;

type TokenUser = Pick<User, "user_id">;

type PutUserValues = {
  username?: string | null;
  email?: string | null;
  password?: string | null;
};

type UserHabits = {
  habit_id: number;
  habit_name: string;
  habit_description: string;
  habit_category: string;
};

// for media api

type Post = {
  post_id: number;
  user_id: number;
  post_text: string;
  post_title: string;
  created_at: string;
  filename: string;
  thumbnail: string;
  filesize: number;
  media_type: string;
};

type PostWithOwner = Post & {
  username: string;
};

type Comment = {
  comment_id: number;
  post_id: number;
  user_id: number;
  comment_text: string;
  created_at: Date;
};

type CommentWithOwner = Comment & {
  username: string;
};

type Like = {
  like_id: number;
  post_id: number;
  user_id: number;
  created_at: Date;
};

type Reflection = {
  reflection_id: number;
  user_id: number;
  prompt_id: number;
  reflection_text: string;
};

type Prompt = {
  prompt_id: number;
  prompt_text: string;
  type: string;
};

type ReflectionWithPrompt = Reflection & {
  prompt_text: string;
};

type Message = {
  message_id: number;
  message_text: string;
  message_author: string;
  last_used_date: Date;
};

type TokenContent = Pick<User, "user_id">;

// for upload server
type FileInfo = {
  filename: string;
  user_id: number;
};

export type {
  User,
  Comment,
  Like,
  TokenContent,
  FileInfo,
  UnauthorizedUser,
  TokenUser,
  PutUserValues,
  UserHabits,
  Post,
  Reflection,
  Prompt,
  ReflectionWithPrompt,
  Message,
  CommentWithOwner,
  PostWithOwner,
};
