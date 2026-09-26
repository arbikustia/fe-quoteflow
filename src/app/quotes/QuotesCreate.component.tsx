import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout";
import { FiArrowLeft } from "react-icons/fi";
import { MOCK_ORDER_ITEMS } from "../../fixture/quotes";

export const QuotesCreateComponent = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <Layout pageTitle={isEditing ? "Edit Order" : "Create New Order"}>
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <button
            onClick={() => navigate("/quotes")}
            className="p-2 rounded-xl text-gray-400 hover:text-brand-text-dark hover:bg-gray-100 transition-all focus:outline-none"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-brand-text-dark">
            {isEditing ? "Edit Order" : "Create New Order"}
          </h2>
        </div>

        <form
          className="w-full flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/quotes");
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Section: Event Details */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Event Details
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  placeholder="Enter name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 min-h-[100px]"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Qty
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    PPh (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                    placeholder="Tax %"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Discount
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                    placeholder="Rp"
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Order Items */}
            <div className="relative flex flex-col lg:block">
              <div className="lg:absolute lg:inset-0 bg-white p-6 h-full rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Items & Pricing
              </h3>

              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <div
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 cursor-pointer flex justify-between items-center"
                >
                  <span className="truncate">
                    {selectedCategories.length > 0
                      ? selectedCategories.join(", ")
                      : "Select Categories"}
                  </span>
                  <span className="text-gray-400 text-xs">▼</span>
                </div>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-2">
                    {Object.keys(MOCK_ORDER_ITEMS).map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedCategories.length > 0 && (
                <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 flex-1 flex flex-col min-h-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <label className="block text-sm font-bold text-indigo-900">
                      Select Items
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={itemSearchQuery}
                        onChange={(e) => setItemSearchQuery(e.target.value)}
                        className="pl-9 pr-8 py-1.5 text-sm rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 w-full sm:w-48 bg-white"
                      />
                      {itemSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setItemSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 flex-1 min-h-0">
                    {selectedCategories.map((cat) => {
                      const catItems = MOCK_ORDER_ITEMS[cat] || [];
                      const filteredItems = catItems.filter((item) =>
                        item
                          .toLowerCase()
                          .includes(itemSearchQuery.toLowerCase()),
                      );

                      if (filteredItems.length === 0) return null;

                      return (
                        <div key={cat} className="space-y-2">
                          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            {cat}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {filteredItems.map((item) => (
                              <label
                                key={item}
                                className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-300 hover:shadow-sm transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item)}
                                  onChange={() => toggleItem(item)}
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 flex-1">
                                  {item}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 mt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/quotes")}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default QuotesCreateComponent;
