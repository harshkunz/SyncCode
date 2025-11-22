/**
 * Room joining form section component that provides room joining functionality.
 * Features:
 * - Room ID validation
 * - Name input validation
 * - Submit handling
 * - Loading states
 *
*
 */

import { ArrowRight } from 'lucide-react';
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/spinner';

import type { JoinRoomForm } from '../types';
import { onRoomIdChange } from '../utils';

interface JoinRoomSectionProps {
  register: UseFormRegister<JoinRoomForm>;
  setValue: UseFormSetValue<JoinRoomForm>;
  handleSubmit: UseFormHandleSubmit<JoinRoomForm>;
  onSubmit: (data: JoinRoomForm) => Promise<boolean> | undefined;
  onError: () => void;
  errors: FieldErrors<JoinRoomForm>;
  isSubmitting: boolean;
  isCreating: boolean;
}

export const JoinRoomSection = ({
  register,
  setValue,
  handleSubmit,
  onSubmit,
  onError,
  errors,
  isSubmitting,
  isCreating
}: JoinRoomSectionProps) => {
  const isDisabled = isCreating || isSubmitting;
  const roomIdErrorId = 'room-id-error';
  const nameErrorId = 'name-join-error';

  return (
    <section aria-labelledby="join-room-heading">
  <form
    onSubmit={handleSubmit(data => onSubmit(data), onError)}
    className="flex flex-col space-y-2 sm:space-y-3"
    noValidate
  >
    <h1 id="join-room-heading" className="text-sm font-mono sm:text-lg text-center">
      Join a Room
    </h1>

    {/* Room ID */}
    <div className="flex flex-col space-y-3" role="group" aria-labelledby="room-id">
      <Label htmlFor="room-id" className="text-sm font-mono sm:text-sm">
        Room ID
      </Label>

      <Input
        id="room-id"
        placeholder="XXXX-XXXX"
        className="
          font-mono text-sm sm:text-sm
          focus-visible:ring-1 focus-visible:ring-[#8420FF] focus-visible:ring-offset-0
          border border-white/20
        "
        disabled={isDisabled}
        aria-required="true"
        aria-invalid={errors.roomId ? 'true' : 'false'}
        aria-describedby={errors.roomId ? roomIdErrorId : undefined}
        {...register('roomId', { onChange: e => onRoomIdChange(e, setValue) })}
      />

      {errors.roomId && (
        <p id={roomIdErrorId} className="text-xs text-red-500" role="alert">
          {errors.roomId.message}
        </p>
      )}
    </div>

    {/* Name */}
    <div className="flex flex-col space-y-3 pb-2 pt-1" role="group" aria-labelledby="name-join">
      <Label htmlFor="name-join" className="text-sm font-mono sm:text-sm">
        Name
      </Label>

      <Input
        id="name-join"
        placeholder="Enter your name"
        className="
          text-sm sm:text-sm font-mono
          focus-visible:ring-1 focus-visible:ring-[#8420FF] focus-visible:ring-offset-0
          border border-white/20
        "
        disabled={isDisabled}
        aria-required="true"
        aria-invalid={errors.name ? 'true' : 'false'}
        aria-describedby={errors.name ? nameErrorId : undefined}
        {...register('name')}
      />

      {errors.name && (
        <p id={nameErrorId} className="text-xs text-red-500" role="alert">
          {errors.name.message}
        </p>
      )}
    </div>

    {/* Button */}
    <Button
      type="submit"
      disabled={isDisabled}
      aria-busy={isSubmitting}
      className={`
        w-4/3 mx-auto py-2
        rounded-full
        bg-gradient-to-r from-blue-700 to-purple-600
        text-white text-xs font-mono
        shadow-md
        transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        active:scale-95
        disabled:opacity-60
        flex items-center justify-center
        relative overflow-hidden
        group
      `}
    >
      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-10 transition-all duration-300 pointer-events-none" />

      {isSubmitting ? (
        <>
          <Spinner className="mr-2 w-5 h-5 animate-spin transition-transform duration-300" />
          Joining...
        </>
      ) : (
        <>
          _ Join Room
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
        </>
      )}
    </Button>

  </form>
</section>

  );
};
