import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin as createEditCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isPending: editStatus } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabinApi(newCabinData, id), // mutationFn sadece bir adet arguman alabilir. Bu yuzden, createEditCabinApi fonksiyonuna bir obje gonderilir.
    onSuccess: () => {
      toast.success('New cabin edited successfully');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      // reset(); //! BUG: Aslinda reset() calisiyor ancak edit submit edildikten sonra form edit edilmeden onceki default verilere donuyor.
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  return { editCabin, editStatus };
}
