import { useAtom } from 'jotai';
import DataTable from '../components/DataTable';
import { storeAtom } from '../jotaiStore';
import { StoreItem, Column } from '../types';

const Store = () => {
  const [stores, setStores] = useAtom(storeAtom);

  const columns: Column<StoreItem>[] = [
    { header: "Store Code", accessor: "storeID", width: "w-24", borderRight: true },
    { header: "Store Name", accessor: "store",   width: "w-1/3", borderRight: true },
    { header: "City",       accessor: "city",    width: "w-1/4", borderRight: false },
    { header: "State",      accessor: "state",   width: "w-1/4", borderRight: false },
  ];

  const validateNewStore = (store: StoreItem): boolean => {
    return (
      store.storeID.trim() !== "" &&
      store.store.trim() !== "" &&
      store.city.trim() !== "" &&
      store.state.trim() !== ""
    );
  };

  return (
    <DataTable<StoreItem>
      columns={columns}
      data={stores}
      setData={setStores}
      enableDrag={true}
      enableDelete={true}
      newItemLabel="NEW STORE"
      initialNewItem={{ id: 0, storeID: "", store: "", city: "", state: "" }}
      validateNewItem={validateNewStore}
    />
  );
};

export default Store;
