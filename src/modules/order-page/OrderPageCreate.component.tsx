import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../app/layout";
import { FiArrowLeft } from "react-icons/fi";
import { MOCK_ORDER_ITEMS } from "../../fixture/quotes";

export const OrderPageCreateComponent = (): React.ReactElement => {
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
      <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-gray-light">
          <button
            onClick={() => navigate("/quotes")}
            className="p-2 rounded-xl text-brand-text-medium hover:text-brand-text-dark hover:bg-brand-gray-light transition-all focus:outline-none"
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
            <div className="bg-brand-white p-6 rounded-2xl border border-brand-gray-light shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-brand-text-dark border-b border-brand-gray-light pb-3">
                Event Details
              </h3>

              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                  placeholder="Enter name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  Remark
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark min-h-[100px]"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-brand-gray-light pt-6">
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    Qty
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    PPh (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                    placeholder="Tax %"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    Discount
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark"
                    placeholder="Rp"
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Order Items */}
            <div className="relative flex flex-col lg:block">
              <div className="lg:absolute lg:inset-0 bg-brand-white p-6 h-full rounded-2xl border border-brand-gray-light shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-brand-text-dark border-b border-brand-gray-light pb-3">
                Order Items & Pricing
              </h3>

              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  Category
                </label>
                <div
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-brand-text-dark cursor-pointer flex justify-between items-center"
                >
                  <span className="truncate">
                    {selectedCategories.length > 0
                      ? selectedCategories.join(", ")
                      : "Select Categories"}
                  </span>
                  <span className="text-brand-text-medium text-xs">▼</span>
                </div>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-brand-white border border-brand-gray-light rounded-xl shadow-lg max-h-60 overflow-y-auto py-2">
                    {Object.keys(MOCK_ORDER_ITEMS).map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-brand-gray-light transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer"
                        />
                        <span className="ml-3 text-sm font-medium text-brand-text-dark">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedCategories.length > 0 && (
                <div className="bg-brand-blue-light/50 p-5 rounded-xl border border-brand-blue-light flex-1 flex flex-col min-h-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <label className="block text-sm font-bold text-indigo-900">
                      Select Items
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
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
                        className="pl-9 pr-8 py-1.5 text-sm rounded-lg border border-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue/20 text-brand-text-dark w-full sm:w-48 bg-brand-white"
                      />
                      {itemSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setItemSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brand-text-medium hover:text-brand-text-medium focus:outline-none"
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
                          <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                            {cat}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {filteredItems.map((item) => (
                              <label
                                key={item}
                                className="flex items-center gap-3 cursor-pointer p-3 bg-brand-white rounded-lg border border-brand-gray-light hover:border-indigo-300 hover:shadow-sm transition-all"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item)}
                                  onChange={() => toggleItem(item)}
                                  className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer"
                                />
                                <span className="text-sm font-medium text-brand-text-dark flex-1">
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

          <div className="pt-6 flex justify-end gap-4 mt-4 border-t border-brand-gray-light">
            <button
              type="button"
              onClick={() => navigate("/quotes")}
              className="px-6 py-2.5 text-sm font-bold text-brand-text-medium bg-brand-white border border-gray-300 hover:bg-brand-gray-light rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gray-light cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-bold text-brand-white bg-brand-blue hover:bg-brand-blue-dark rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default OrderPageCreateComponent;
