import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin as createEditCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isPending: createStatus } = useMutation({
    mutationFn: createEditCabinApi,
    onSuccess: () => {
      toast.success('New cabin added successfully');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      // reset();
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  return { createCabin, createStatus };
}
