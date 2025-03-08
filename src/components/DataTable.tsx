import { useState } from 'react';
import { RxDragHandleHorizontal } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DataTableProps } from '../types';

function DataTable<T extends { id: number }>({
  columns,
  data,
  setData,
  enableDrag = false,
  enableDelete = true,
  newItemLabel,
  initialNewItem,
  validateNewItem,
  formatValue,
}: DataTableProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<T>(initialNewItem);
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Delete an item by id
  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  // Edit an item
  const handleEdit = (id: number) => {
    setEditingId(id);
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit });
    }
  };

  // Update an item
  const handleUpdate = () => {
    if (validateNewItem(newItem)) {
      setData(
        data.map(item =>
          item.id === editingId ? { ...item, ...newItem } : item
        )
      );
      setEditingId(null);
      setNewItem(initialNewItem);
    }
  };

  // Add a new item
  const handleAdd = () => {
    if (validateNewItem(newItem)) {
      const newId = Math.max(...data.map(item => item.id), 0) + 1;
      setData([...data, { ...newItem, id: newId }]);
      setNewItem(initialNewItem);
      setIsAddingItem(false);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || !enableDrag) return;

    if (draggedIndex !== index) {
      const newData = [...data];
      const draggedItem = newData[draggedIndex];

      // Remove dragged item and insert it at new position
      newData.splice(draggedIndex, 1);
      newData.splice(index, 0, draggedItem);

      // Reassign IDs to maintain order
      const updatedData = newData.map((item, idx) => ({
        ...item,
        id: idx + 1,
      }));

      setData(updatedData);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewItem(initialNewItem);
  };

  return (
    <div className="bg-neutral-200 min-h-screen p-4 border-t-3 border-neutral-300">
      <div className="mx-auto bg-white rounded shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-neutral-400">
                {enableDelete && (
                  <th className="p-4 text-left border-r border-neutral-300 w-16"></th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`p-4 text-left text-neutral-500 ${column.width || ''} ${
                      column.borderRight ? 'border-r border-neutral-300' : ''
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-neutral-300 hover:bg-gray-50 ${(index - 1) % 2 === 0 ? 'bg-gray-50' : ''}`}
                  draggable={enableDrag}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => editingId !== item.id && handleEdit(item.id)}
                >
                  {enableDelete && (
                    <td className="p-2 w-16 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-2xl cursor-pointer"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-4 ${column.width || ''} ${
                        column.borderRight ? 'border-r border-neutral-300' : ''
                      }`}
                    >
                      {column.accessor === 'id' && enableDrag ? (
                        <div className="flex items-center justify-start gap-x-2">
                          <div className="mr-2 cursor-move">
                            <RxDragHandleHorizontal />
                          </div>
                          <span>{String(item[column.accessor as keyof T])}</span>
                        </div>
                      ) : editingId === item.id ? (
                        <input
                          type={column.accessor === 'price' || column.accessor === 'cost' ? 'number' : 'text'}
                          value={(newItem[column.accessor as keyof T] ?? '') as string | number}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              [column.accessor]:
                                column.accessor === 'price' || column.accessor === 'cost'
                                  ? parseFloat(e.target.value) || 0
                                  : e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          onClick={(e) => e.stopPropagation()}
                          step={column.accessor === 'price' || column.accessor === 'cost' ? '0.01' : undefined}
                        />
                      ) : column.render ? (
                        column.render(item[column.accessor as keyof T])
                      ) : formatValue ? (
                        formatValue(item[column.accessor as keyof T], column.accessor)
                      ) : (
                        item[column.accessor as keyof T] as unknown as React.ReactNode
                      )}
                    </td>
                  ))}
                  {editingId === item.id && (
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate();
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {isAddingItem && (
                <tr className="border-b bg-gray-50">
                  {enableDelete && <td className="p-4 w-16"></td>}
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={`p-4 ${column.width || ''} ${
                        column.borderRight ? 'border-r border-neutral-300' : ''
                      }`}
                    >
                      {column.accessor === 'id' ? (
                        'New'
                      ) : (
                        <input
                          type={column.accessor === 'price' || column.accessor === 'cost' ? 'number' : 'text'}
                          value={(newItem[column.accessor as keyof T] ?? '') as string | number}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              [column.accessor]:
                                column.accessor === 'price' || column.accessor === 'cost'
                                  ? parseFloat(e.target.value) || 0
                                  : e.target.value,
                            })
                          }
                          placeholder={column.header}
                          className="w-full p-2 border rounded"
                          step={column.accessor === 'price' || column.accessor === 'cost' ? '0.01' : undefined}
                        />
                      )}
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleAdd}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setIsAddingItem(false)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={() => {
          setIsAddingItem(!isAddingItem);
          setEditingId(null);
          setNewItem(initialNewItem);
        }}
        className="bg-[#ffab91] font-bold py-2 px-4 rounded shadow mt-3"
      >
        {newItemLabel}
      </button>
    </div>
  );
}

export default DataTable;
