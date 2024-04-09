export interface User {
    blocked: boolean;
    cell: string;
    char_d: number;
    char_m: number;
    char_w: number;
    email: string;
    fullname: string;
    nickname: string;
    notifications: any[];
    password: string;
    photoprofile: string;
    popularity: number;
    version: string;
    _id: string;
  }

  export interface Channel {
    creator: string;
    description: string;
    isSilenceable: boolean;
    list_mess: any[];
    list_posts: any[];
    list_users: any[];
    name: string;
    photoProfile: string;
    photoprofilex: number;
    photoprofiley: number;
    popularity: string;
    type: string;
    usersSilenced: any[];
    _id: string;
  }