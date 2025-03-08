import {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
  } from 'react';
  import { useAtom } from 'jotai';
  import { AgGridReact } from 'ag-grid-react';
  import {
    ClientSideRowModelModule,
    ValidationModule,
    ColDef,
    GridApi,
    GridReadyEvent,
    ValueFormatterParams,
    CellClassParams,
    ColGroupDef,
    CellStyleModule,
    CustomEditorModule,
    ColumnAutoSizeModule,
    TextFilterModule
  } from 'ag-grid-community';
  import {
    planningAtom,
    storeAtom,
    skuAtom,
    calendarAtom,
  } from '../jotaiStore';
  import { PlanningRowData, CalendarItem } from '../types';
  
  const NumericCellEditor = (props: { value: string; stopEditing: () => void }) => {
    const [value, setValue] = useState(props.value);
  
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };
  
    const onBlur = () => {
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue)) {
        props.stopEditing();
      }
    };
  
    return (
      <input
        type="number"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          textAlign: 'right',
        }}
        min={0}
        autoFocus
      />
    );
  };
  
  const Planning = () => {
    const [planningData] = useAtom(planningAtom);
    const [stores] = useAtom(storeAtom);
    const [skus] = useAtom(skuAtom);
    const [calendar] = useAtom(calendarAtom);
    const [rowData, setRowData] = useState<PlanningRowData[]>([]);
    const gridRef = useRef<AgGridReact>(null);
    const gridApiRef = useRef<GridApi | null>(null);
  
    useEffect(() => {
      const transformedData: { [key: string]: PlanningRowData } = {};
  
      stores.forEach((store) => {
        skus.forEach((sku) => {
          const rowKey = `${store.storeID}-${sku.skuCode}`;
          transformedData[rowKey] = {
            id: rowKey,
            storeID: store.storeID,
            storeName: store.store,
            skuCode: sku.skuCode,
            skuLabel: sku.label,
            price: sku.price,
            cost: sku.cost,
          };
          calendar.forEach((cal) => {
            const salesUnitsKey = `${cal.week}_SalesUnits`;
            transformedData[rowKey][salesUnitsKey] = 0;
          });
        });
      });
  
      planningData.forEach((item) => {
        const rowKey = `${item.storeID}-${item.skuCode}`;
        const salesUnitsKey = `${item.week}_SalesUnits`;
        if (transformedData[rowKey]) {
          transformedData[rowKey][salesUnitsKey] = item.salesUnits;
        }
      });
  
      setRowData(Object.values(transformedData));
    }, [planningData, stores, skus, calendar]);
  
    const calendarByMonth = useMemo(() => {
      const groupedByMonth: { [key: string]: CalendarItem[] } = {};
      calendar.forEach((cal) => {
        if (!groupedByMonth[cal.month]) {
          groupedByMonth[cal.month] = [];
        }
        groupedByMonth[cal.month].push(cal);
      });
      return groupedByMonth;
    }, [calendar]);
  
    const columnDefs = useMemo(() => {
      const baseColumns: (ColDef | ColGroupDef)[] = [
        {
          headerName: 'Store',
          children: [
            {
              field: 'storeID',
              headerName: 'Code',
              width: 80,
              hide: true,
              sortable: true,
              filter: true,
            },
            {
              field: 'storeName',
              width: 180,
              pinned: 'left',
              sortable: true,
              filter: true,
            },
          ],
        } as ColGroupDef,
        {
          headerName: 'SKU',
          children: [
            {
              field: 'skuCode',
              headerName: 'Code',
              width: 120,
              hide: true,
              sortable: true,
              filter: true,
            },
            {
              field: 'skuLabel',
              headerName: 'SKU',
              width: 200,
              pinned: 'left',
              sortable: true,
              filter: true,
            },
          ],
        } as ColGroupDef,
      ];
  
      Object.entries(calendarByMonth).forEach(([, monthCalendarItems]) => {
        const monthLabel = monthCalendarItems[0].monthLabel || 'Feb';
        const weekColumns: ColDef[] = [];
        monthCalendarItems.forEach((calItem) => {
          const weekLabel =
            calItem.weekLabel ||
            `Week ${calItem.week.toString().padStart(2, '0')}`;
          const salesUnitsField = `${calItem.week}_SalesUnits`;
          const salesDollarsField = `${calItem.week}_SalesDollars`;
          const gmDollarsField = `${calItem.week}_GMDollars`;
          const gmPercentField = `${calItem.week}_GMPercent`;
  
          weekColumns.push({
            headerName: weekLabel,
            children: [
              {
                field: salesUnitsField,
                headerName: 'Sales Units',
                width: 115,
                editable: true,
                cellEditor: NumericCellEditor,
                valueFormatter: (params: ValueFormatterParams) =>
                  params.value !== undefined
                    ? Number(params.value).toFixed(2)
                    : '0.00',
                cellStyle: { textAlign: 'right' },
              },
              {
                field: salesDollarsField,
                headerName: 'Sales Dollars',
                width: 115,
                valueGetter: (params) => {
                  const salesUnits = params.data[salesUnitsField] || 0;
                  const price = params.data.price || 0;
                  return salesUnits * price;
                },
                valueFormatter: (params: ValueFormatterParams) =>
                  params.value !== undefined
                    ? `$ ${params.value.toFixed(2)}`
                    : '$ 0.00',
                cellStyle: { textAlign: 'right' },
              },
              {
                field: gmDollarsField,
                headerName: 'GM Dollars',
                width: 115,
                valueGetter: (params) => {
                  const salesUnits = params.data[salesUnitsField] || 0;
                  const price = params.data.price || 0;
                  const cost = params.data.cost || 0;
                  const salesDollars = salesUnits * price;
                  const costDollars = salesUnits * cost;
                  return salesDollars - costDollars;
                },
                valueFormatter: (params: ValueFormatterParams) =>
                  params.value !== undefined
                    ? `$ ${params.value.toFixed(2)}`
                    : '$ 0.00',
                cellStyle: { textAlign: 'right' },
              },
              {
                field: gmPercentField,
                headerName: 'GM Percent',
                width: 115,
                valueGetter: (params) => {
                  const salesUnits = params.data[salesUnitsField] || 0;
                  const price = params.data.price || 0;
                  const cost = params.data.cost || 0;
                  const salesDollars = salesUnits * price;
                  const costDollars = salesUnits * cost;
                  const gmDollars = salesDollars - costDollars;
                  return salesDollars > 0
                    ? (gmDollars / salesDollars) * 100
                    : 0;
                },
                valueFormatter: (params: ValueFormatterParams) =>
                  params.value !== undefined
                    ? `${params.value.toFixed(2)} %`
                    : '0.00 %',
                cellStyle: (params: CellClassParams) => {
                  const value = params.value || 0;
                  if (value >= 40) {
                    return { backgroundColor: '#c8e6c9', textAlign: 'right' };
                  } else if (value >= 30) {
                    return { backgroundColor: '#fff9c4', textAlign: 'right' };
                  } else if (value >= 8) {
                    return { backgroundColor: '#ffcc80', textAlign: 'right' };
                  } else {
                    return { backgroundColor: '#ffcdd2', textAlign: 'right' };
                  }
                },
              },
            ],
          } as ColGroupDef);
        });
        baseColumns.push({
          headerName: monthLabel,
          children: weekColumns,
        });
      });
      return baseColumns;
    }, [calendar, calendarByMonth]);
  
    const onGridReady = useCallback((params: GridReadyEvent) => {
      gridApiRef.current = params.api;
      params.api.sizeColumnsToFit();
    }, []);
  
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 w-full ag-theme-alpine">
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              minWidth: 100,
            }}
            onGridReady={onGridReady}
            rowHeight={40}
            headerHeight={35}
            groupHeaderHeight={35}
            stopEditingWhenCellsLoseFocus={true}
            modules={[
              ClientSideRowModelModule,
              ValidationModule,
              CellStyleModule,
              CustomEditorModule,
              ColumnAutoSizeModule,
              TextFilterModule
            ]}
          />
        </div>
      </div>
    );
  };
  
  export default Planning;
  