import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Memeber, Profile, Server } from "@prisma/client"

export type ServerWithMembersWithProfiles = Server & {
    members: (Memeber & {profile: Profile})[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};