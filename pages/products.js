import Layout from "@/Components/Layout";
import Link from "next/link";
import Arrow from '../assets/EnterArrow.svg';
import { useEffect, useState } from "react";
import Pagination from 'react-js-pagination';
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
    axios.get('/api/categories').then(response => {
      const categories = {};
      response.data.forEach(category => {
        categories[category._id] = category.name;
      });
      setCategoryNames(categories);
    });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination when search query changes
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Layout>
      <main className="w-[82vw] flex flex-col items-center justify-center max-h-[auto] min-h-[43rem] bg-[#fff5] max600:w-[95vw] max600:relative max600:mt-6" style={{ boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.1)", borderRadius: "0.8rem" }}>
        <section className="w-full h-[7%] bg-[#2c2c2c] rounded-t-[0.8rem] flex items-center justify-end">
          <div className="flex bg-white h-[2.4rem] mr-[4rem] w-[28.25rem] rounded-[0.1875rem] p-[0.1rem] max600:mr-[1.2rem] max600:my-[0.3rem] max600:w-[80vw]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1.9rem] h-[1.9rem] opacity-60 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input className="flex-1 shadow-none mt-2 items-center border-none justify-center outline-none rounded-md K2D text-[#000] text-[1rem] tracking-[1px] font-[600] max600:text-[0.8rem]" type="text" placeholder="Search “Name, Email, Number”" value={searchQuery} onChange={handleSearchInputChange} />
            <img className="w-[1rem] h-[1.5rem] mt-1 mr-[0.8rem] opacity-50" src={Arrow} alt="" />
          </div>
          <Link className="bg-[#4e9c4e] text-white py-3 px-4 flex items-center mr-8 max600:absolute max600:top-[-1.4%] max600:right-[-5%] max600:p-1 max600:rounded-[7px]" href={'/products/new'}>+ Add product</Link>
        </section>
        <section className="table_body K2D w-[95%] border border-[#2e2e2e] rounded-[6px] overflow-auto bg-[#fffb] my-[0.8rem] mx-auto custom-scrollbar">
          <table className="w-[100%]">
            <thead className="border-b text-[1.1rem] font-[600] border-[#2e2e2e]">
              <tr>
                <td>Product name</td>
                <td>Category</td>
                <td>Description</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => (
                <tr key={product._id} className="">
                  <td>{product.title}</td>
                  <td>{categoryNames[product.category]}</td>
                  <td>{product.description}</td>
                  <td className="flex gap-2">
                    <Link className="btn-default flex h-8" href={'/products/edit/' + product._id}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </Link>
                    <Link className="btn-red flex h-8" href={'/products/delete/' + product._id}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <Pagination
            activePage={currentPage}
            itemsCountPerPage={productsPerPage}
            totalItemsCount={filteredProducts.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
      </main>
    </Layout>
  );
}
