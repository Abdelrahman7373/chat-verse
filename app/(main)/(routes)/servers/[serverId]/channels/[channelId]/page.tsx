import { ChatHeader } from "@/components/chat/chatHeader";
import { ChatInput } from "@/components/chat/chatInput";
import { ChatMessages } from "@/components/chat/chatMessages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}



const ChannelPage = async ({params}:ChannelPageProps) => {
  const profile = await currentProfile();

  if(!profile) {return redirectToSignIn();}

  const channel = await db.channel.findUnique({
    where: {id: params.channelId}
  });

  const member = await db.memeber.findFirst({
    where: {serverId: params.serverId, profileId: profile.id,}
  });

  if(!channel || !member) {redirect('/');}
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages member={member} name={channel.name} chatId={channel.id} type="channel" apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{channelId: channel.id, serverId: channel.serverId}} paramKey="channelId" paramValue={channel.id} />
          <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{channelId: channel.id, serverId: channel.serverId,}} />
          <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <>
          <MediaRoom chatId={channel.id} video={false} audio={true} />
          <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </>
      )}
      {channel.type === ChannelType.VIDEO && (
        <>
          <MediaRoom chatId={channel.id} video={true} audio={true} />
          <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </>
      )}
    </div>
  )
}

export default ChannelPage;
