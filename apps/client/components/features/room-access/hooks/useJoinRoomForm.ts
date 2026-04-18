/**
 * Custom hook for handling room joining form state.
 * Features:
 * - Form validation with Zod
 * - Room ID validation
 * - Default values handling
 *
 *
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { JoinRoomForm } from '../lib/types';
import { isRoomIdValid } from '../lib/utils';
import { joinRoomSchema } from '../lib/validator';

export const useJoinRoomForm = (roomId: string) => {
  return useForm<JoinRoomForm>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      name: '',
      roomId: isRoomIdValid(roomId) ? roomId : ''
    }
  });
};
