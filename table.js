<main
    className="w-[82vw] max-h-[auto] min-h-[43rem] bg-[#fff5] max600:w-[90vw] max600:relative"
    style={{
        boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.8rem",
    }}
>
    <section className="w-full h-[7%] bg-[#2c2c2c] rounded-t-[0.8rem] flex items-center justify-end">
        <div className="flex bg-white mr-[4rem] w-[28.25rem] rounded-[0.1875rem] p-[0.1rem] max600:mr-[1.2rem] max600:my-[0.3rem] max600:w-[80vw]">
            {/* <img
                            className="w-[1.9rem] h-[1.9rem] opacity-60 ml-2"
                            src={SearchIcon}
                            alt=""
                        /> */}
            <input
                className="flex-1 outline-none rounded-md K2D text-[#000] text-[0.9rem] tracking-[1px] font-[600] max600:text-[0.8rem] "
                type="text"
                placeholder={"Search “Name, Email, Number”"}
            // value={searchInput}
            // onChange={handleSearchInputChange}
            />
            {/* <img
                            className="w-[1rem] h-[1.5rem] mt-1 mr-[0.8rem] opacity-50"
                            src={Arrow}
                            alt=""
                        /> */}
        </div>
        <button className="bg-[#3193b6] text-white py-3 px-4 flex items-center mr-8 max600:absolute max600:top-[-5%] max600:right-[-5%] max600:p-1 max600:rounded-[7px]"
            onClick={() => setIsUserAdd(true)}
        >
            <span className="mr-2">+</span> Add Leads
        </button>
    </section>
    <section className="table_body K2D w-[95%] border border-[#2e2e2e] rounded-[6px] overflow-auto bg-[#fffb] my-[0.8rem] mx-auto custom-scrollbar">
        <table className="w-[100%]">
            <thead className="border-b text-[1.1rem] font-[600] border-[#2e2e2e]">
                <tr>
                    <th className="w-1/6 ">Name</th>
                    <th className="w-1/6 ">EmailId</th>
                    <th className="w-1/6">PhoneNumber</th>
                    <th className="w-1/6">Date</th>
                    <th className="w-1/6">Device</th>
                    <th className="w-1/6">Age</th>
                    <th className="w-1/6"></th>
                </tr>
            </thead>
            <tbody>
                {/* Placeholder for table rows */}
            </tbody>
        </table>
    </section>
    {/* <Pagination
                    count={Math.ceil(filteredLeads.length / itemsPerPage)}
                    page={currentPage}
                    onChange={paginate}
                    className="custom-pagination"
                /> */}
</main>