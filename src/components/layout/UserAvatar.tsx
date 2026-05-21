import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfileImage } from '@/data/userProfiles';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ name, imageUrl, size = 'md', className = '' }: UserAvatarProps) {
  const profileImage = imageUrl || getUserProfileImage(name);

  const sizeClasses = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10',
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {profileImage && <AvatarImage src={profileImage} alt={name} />}
      <AvatarFallback className="bg-gray-200 text-gray-500">
        <User className={iconSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}
