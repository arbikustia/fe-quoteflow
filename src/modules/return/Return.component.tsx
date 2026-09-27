import React from "react";
import Layout from "../../app/layout";
import { FiSearch, FiUpload, FiCheckCircle } from "react-icons/fi";
import type { ReturnProps } from "./Return.type";

export const ReturnComponent: React.FC<ReturnProps> = ({
  searchCode,
  setSearchCode,
  quote,
  error,
  returnItems,
  isSubmitted,
  handleSearch,
  handlePhotoUpload,
  handleRemarksChange,
  handleSubmit,
}) => {
  return (
    <Layout pageTitle="Return Equipment">
      <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-gray-light p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-brand-text-dark mb-6">Scan / Input Quotation Code</h2>
        
        <form onSubmit={handleSearch} className="flex items-end gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-brand-text-dark mb-2">Quotation Code (e.g. Q-999)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
                <FiSearch />
              </div>
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter quotation ID"
                className="w-full pl-10 pr-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-brand-blue text-brand-white font-bold rounded-xl hover:bg-brand-blue-dark transition-colors"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="p-4 bg-brand-orange-light text-brand-orange rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        {isSubmitted && (
          <div className="p-6 bg-brand-blue-light rounded-2xl mb-8 flex flex-col items-center justify-center text-center border border-brand-blue-light">
            <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue-dark mb-2">Return Processed Successfully</h3>
            <p className="text-brand-blue">All equipment for {quote?.id} has been recorded.</p>
          </div>
        )}

        {quote && !isSubmitted && (
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="bg-brand-gray-light p-4 rounded-xl mb-6 flex justify-between items-center border border-brand-gray-light">
              <div>
                <h3 className="font-bold text-brand-text-dark">{quote.name}</h3>
                <p className="text-sm text-brand-text-medium">{quote.location}</p>
              </div>
              <span className="px-3 py-1 bg-brand-blue-light text-brand-blue-dark rounded-lg text-sm font-bold">
                {quote.id}
              </span>
            </div>

            <div className="space-y-4">
              {quote.selectedItems.map((item, idx) => (
                <div key={idx} className="bg-brand-white border border-brand-gray-light rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:border-brand-blue-light transition-colors">
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-text-dark text-lg mb-1">{item}</h4>
                    <p className="text-sm text-brand-text-medium mb-4">Item ID: {quote.id}-{idx + 1}</p>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-brand-text-dark">
                        Condition / Remarks <span className="text-brand-text-medium font-normal">(Required if no photo)</span>
                      </label>
                      <input
                        type="text"
                        value={returnItems[item]?.remarks || ""}
                        onChange={(e) => handleRemarksChange(item, e.target.value)}
                        placeholder="e.g. Good condition, scratches on side..."
                        className="w-full px-4 py-2 bg-brand-gray-light border border-brand-gray-light rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-48 flex flex-col justify-center">
                    <label className="block text-sm font-semibold text-brand-text-dark mb-2">Evidence Photo</label>
                    <div className="relative group">
                      {returnItems[item]?.photo ? (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-brand-blue-light">
                          <img src={returnItems[item].photo!} alt="Evidence" className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-brand-white text-sm font-bold">
                            Change
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(item, e)} />
                          </label>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-brand-gray-light border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-brand-gray-light hover:border-indigo-300 transition-colors">
                          <FiUpload className="w-6 h-6 text-brand-text-medium mb-2 group-hover:text-brand-blue transition-colors" />
                          <span className="text-xs font-medium text-brand-text-medium group-hover:text-brand-blue">Upload Photo</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(item, e)} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-4 bg-brand-blue text-brand-white font-bold rounded-xl hover:bg-brand-blue-dark shadow-md hover:shadow-lg transition-all"
              >
                Submit Return Report
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};
