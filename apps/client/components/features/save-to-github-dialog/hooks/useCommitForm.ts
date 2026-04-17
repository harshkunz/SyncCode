/**
 * Custom hook for handling GitHub commit form state.
 * Features:
 * - Form validation with Zod
 * - Commit message handling
 * - Default values management
 *
*
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { CommitForm } from '../lib/types';
import { commitSchema } from '../lib/validator';

export const useCommitForm = () => {
  return useForm<CommitForm>({
    resolver: zodResolver(commitSchema),
    defaultValues: {
      fileName: '',
      commitSummary: ''
    }
  });
};
