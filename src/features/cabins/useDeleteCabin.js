import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin as deleteCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useDeleteCabin() {
  // supabase'den fetch edilen veriler cache'de tutulur ve app.jsx'te yazdigimiz kod ile staleTime(Invalidate) ile belirtilen surede cache'den veri cekilir. Eger veriler eski ise, yeni veri fetch edilir.
  // Bu kodda ise, delete islemi yapildiktan sonra, cache'de tutulan verileri guncellemek icin queryClient kullanilir. queryClient.invalidateQueries fonksiyonu ile cache'de tutulan veri silinir ve tekrar fetch edilir. Boylelikle, cache'de tutulan veriler guncellenmis olur ve UI'da guncel veriler goruntulenir.
  const queryClient = useQueryClient();

  const { mutate: deleteCabin, isPending: isDeleting } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success('Cabin deleted successfully');
      // Invalidate the query to refetch the fresh data
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: err => toast.error(err.message),
  });

  // const isDeleting = status === 'pending';

  return { deleteCabin, isDeleting };
}
