import Image from "next/image";
import Link from "next/link";

export function UserAvatar({
	profile,
	size = 48,
	online = false,
}: {
	profile?: { avatar_url: string | null; username: string | null };
	size?: number;
	online?: boolean;
}) {
	if (!profile || !profile.avatar_url || !profile.username)
		return (
			<div className={`${online ? "online" : ""} avatar`}>
				<div className="aspect-w-1 aspect-h-1 shrink-0 grow-0 rounded-full" />
			</div>
		);

	return (
		<div className={`avatar ${online ? "online" : ""}`}>
			<div className="aspect-w-1 aspect-h-1 w-full h-full shrink-0 grow-0 rounded-full">
				<Link href={`/${profile.username}`}>
					<Image
						src={profile.avatar_url}
						alt={`${profile.username}'s profile image`}
						width={size}
						height={size}
						placeholder="empty"
					/>
				</Link>
			</div>
		</div>
	);
}
