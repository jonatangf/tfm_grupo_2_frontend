export interface IComment {
  commentId: number;
  userId: number;
  user: string;
  title?: string;
  message: string;
  avatar?: string;
  replies?: ICommentReply[];
  createdAt?: string | Date;
}

export interface ICommentReply {
  replyId?: number;
  userId: number;
  user: string;
  message: string;
  avatar?: string;
  createdAt?: string | Date;
}

export interface ICreateComment {
  title?: string;
  message: string;
}

export interface ICreateReply {
  message: string;
}
