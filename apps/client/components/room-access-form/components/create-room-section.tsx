/**
 * Create room section component that provides room creation form.
 * Features:
 * - Name input validation
 * - Submit handling
 * - Loading states
 * - Error display
 *
*
 */

import { CirclePlus } from 'lucide-react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/spinner';

import type { CreateRoomForm } from '../types';

interface CreateRoomSectionProps {
  register: UseFormRegister<CreateRoomForm>;
  handleSubmit: UseFormHandleSubmit<CreateRoomForm>;
  onSubmit: (data: CreateRoomForm) => Promise<string> | undefined;
  onError: () => void;
  errors: FieldErrors<CreateRoomForm>;
  isSubmitting: boolean;
  isJoining: boolean;
}

export const CreateRoomSection = ({
  register,
  handleSubmit,
  onSubmit,
  onError,
  errors,
  isSubmitting,
  isJoining
}: CreateRoomSectionProps) => {
  const isDisabled = isSubmitting || isJoining;
  const inputId = 'name-create';
  const errorId = 'name-error';

  return (
    <section aria-labelledby="create-room-heading">
      <form
        onSubmit={handleSubmit(data => onSubmit(data), onError)}
        className="flex flex-col space-y-2 sm:space-y-3"
        noValidate
      >
        <h1 id="create-room-heading" className="text-sm font-mono sm:text-lg text-center">
          Create a Room
        </h1>
        <div className="flex flex-col space-y-3 pb-2" role="group" aria-labelledby={inputId}>
          <Label htmlFor={inputId} className="text-sm font-mono sm:text-sm">
            Name
          </Label>
          <Input
            id={inputId}
            placeholder="Enter your name"
            className="
              font-mono text-sm sm:text-sm
              focus-visible:ring-1 focus-visible:ring-[#8420FF] focus-visible:ring-offset-0
              border border-white/30
            "
            disabled={isDisabled}
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? errorId : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id={errorId} className="text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isSubmitting}
          className={`
            w-4/3 mx-auto py-2
            rounded-full font-mono
            bg-gradient-to-r from-blue-700 to-purple-600
            text-white text-xs
            shadow-md
            transition-all duration-300
            hover:scale-105 hover:shadow-2xl
            active:scale-95
            disabled:opacity-60
            flex items-center justify-center
            relative overflow-hidden
            mb-4
            group
          `}
        >
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-10 transition-all duration-300 pointer-events-none" />

          {isSubmitting ? (
            <Spinner className="mr-2 w-5 h-5 animate-spin transition-transform duration-300" />
          ) : (
            <CirclePlus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform duration-500" aria-hidden="true" />
          )}
          {isSubmitting ? 'Creating...' : 'Create Room _'}
        </Button>

      </form>
    </section>
  );
};
