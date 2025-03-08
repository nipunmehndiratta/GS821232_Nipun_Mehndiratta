import { useAtom } from 'jotai';
import DataTable from '../components/DataTable';
import { skuAtom } from '../jotaiStore';
import { SKUItem, Column } from '../types';

const SKUPage = () => {
  const [skus, setSkus] = useAtom(skuAtom);

  const columns: Column<SKUItem>[] = [
    { header: "SKU Code",  accessor: "skuCode",    width: "w-1/6", borderRight: true },
    { header: "Label",     accessor: "label",      width: "w-1/6", borderRight: true },
    { header: "Class",     accessor: "class",      width: "w-1/6", borderRight: true },
    { header: "Department",accessor: "department", width: "w-1/6", borderRight: true },
    {
      header: "Price",
      accessor: "price",
      width: "w-1/6",
      borderRight: true,
      render: (value: string | number) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : value,
    },
    {
      header: "Cost",
      accessor: "cost",
      width: "w-1/6",
      render: (value: string | number) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : value,
    },
  ];

  const validateNewSKU = (item: SKUItem): boolean => {
    return (
      item.skuCode.trim() !== "" &&
      item.label.trim() !== "" &&
      item.price >= 0 &&
      item.cost >= 0
    );
  };

  return (
    <DataTable<SKUItem>
      columns={columns}
      data={skus}
      setData={setSkus}
      enableDrag={false}
      enableDelete={true}
      newItemLabel="NEW SKU"
      initialNewItem={{
        id: 0,
        skuCode: "",
        label: "",
        class: "",
        department: "",
        price: 0,
        cost: 0,
      }}
      validateNewItem={validateNewSKU}
    />
  );
};

export default SKUPage;
