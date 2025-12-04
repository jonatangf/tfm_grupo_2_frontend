export interface IComment {
  commentId: number;
  user: string;
  title?: string;
  message: string;
  replies?: ICommentReply[];
  createdAt?: string | Date;
}

export interface ICommentReply {
  replyId?: number;
  user: string;
  message: string;
  createdAt?: string | Date;
}

export interface ICreateComment {
  title?: string;
  message: string;
}

export interface ICreateReply {
  message: string;
}
