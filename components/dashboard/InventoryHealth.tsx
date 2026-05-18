interface InventoryHealthProps {
  activeProducts: number;
  outOfStockProducts: number;
  totalProducts?: number;
  isLoading: boolean;
  isError: boolean;
}

export function InventoryHealth({
  activeProducts,
  outOfStockProducts,
  totalProducts,
  isLoading,
  isError,
}: InventoryHealthProps) {
  const total = totalProducts ?? activeProducts + outOfStockProducts;
  const pctActive = total > 0 ? Math.round((activeProducts / total) * 100) : 0;

  return (
    <div className="bg-white border border-gray-100 rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-black">Inventory Health</h4>
      </div>

      {isLoading ? (
        <div className="h-28 rounded bg-gray-50 animate-pulse" />
      ) : isError ? (
        <div className="h-28 flex items-center justify-center bg-red-50/10 rounded">
          <p className="text-xs font-bold text-red-500">
            Unable to load inventory data
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400">
                Products In Stock
              </p>
              <p className="text-lg font-black text-black">
                {activeProducts.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400">
                Out of Stock
              </p>
              <p
                className={`text-lg font-black ${outOfStockProducts > 0 ? "text-red-600" : "text-gray-600"}`}
              >
                {outOfStockProducts.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400">Total</p>
              <p className="text-lg font-black text-black">
                {total.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all"
                style={{ width: `${pctActive}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 text-gray-400">
              {pctActive}% in stock
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
