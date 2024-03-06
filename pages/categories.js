import Layout from "@/Components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Arrow from '../assets/EnterArrow.svg';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [createCategoryForm, setCreateCategoryForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(',').map(value => value.trim()),
      })),
    };
    console.log("Data to be saved:", data);
    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put('/api/categories', data);
        setEditedCategory(null);
      } else {
        await axios.post('/api/categories', data);
      }
      console.log("Category saved successfully!"); // Log success message
      setName('');
      setParentCategory('');
      setProperties([]);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error); // Log error message if any
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      (category.properties || []).map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  function addCategory() {
    if (!createCategoryForm) {
      setCreateCategoryForm(true)
    } else {
      setCreateCategoryForm(false)
    }
  }
  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
    // You can perform additional actions here if needed, like filtering the categories based on the search query
  }

  console.log(createCategoryForm)
  return (
    <Layout>
      <h1 className="poppins-semibold">Categories</h1>
      <div className="flex flex-col justify-center items-center">
        <label>
          {editedCategory
            ? `Edit category ${editedCategory.name}`
            : ""}
        </label>
        <form onSubmit={saveCategory}>
          {(createCategoryForm || editedCategory) && (
            <div className="flex justify-center items-center flex-wrap">
              <div className="text-[1.2rem] text-black font-[600]">Create new category</div>
              <div className="flex  justify-center items-center gap-3 w-full">
                <input
                  className="mb-0 min-w-[20rem]"
                  type="text"
                  placeholder={'Category name'}
                  onChange={ev => setName(ev.target.value)}
                  value={name}
                />
                <select
                  className="min-w-[20rem]"
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
                  <option value="">No parent category</option>
                  {categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="mb-2 mr-2 flex justify-end w-[80vw] ">
            <button
              onClick={addProperty}
              type="button"
              className=" p-2 mr-2 rounded-md bg-[#474b65] text-white text-[1rem] font-[400] mb-2" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
              Add new property
            </button>
            {properties.length > 0 && properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  onChange={ev =>
                    handlePropertyNameChange(
                      index,
                      property,
                      ev.target.value
                    )}
                  value={property.name}
                  placeholder="property name (example: color)" />
                <input
                  type="text"
                  className="mb-0"
                  onChange={ev =>
                    handlePropertyValuesChange(
                      index,
                      property, ev.target.value
                    )}
                  value={property.values}
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red">
                  Remove
                </button>
              </div>
            ))}
          </div>
          {editedCategory && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null);
                  setName('');
                  setParentCategory('');
                  setProperties([]);
                }}
                className="btn-default">Cancel</button>
              <button type="submit"
                className="btn-primary py-1 mb-2">
                Save
              </button>
            </div>
          )}
        </form>
        {!editedCategory && (
          <main className="w-[82vw] max-h-[auto] min-h-[43rem] bg-[#fff5] max600:w-[90vw] max600:relative" style={{ boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.1)", borderRadius: "0.8rem" }}>
            <section className="w-full h-[7%] bg-[#2c2c2c] rounded-t-[0.8rem] flex items-center justify-end">
              <div className="flex h-[2.1rem] bg-white mr-[4rem] w-[28.25rem] rounded-[0.1875rem] p-[0.1rem] max600:mr-[1.2rem] max600:my-[0.3rem] max600:w-[80vw]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1.9rem] h-[1.9rem] opacity-60 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  className="flex-1 shadow-none mt-2 items-center border-none justify-center outline-none rounded-md K2D text-[#000] text-[1rem] tracking-[1px] font-[600] max600:text-[0.8rem]"
                  type="text"
                  placeholder="Search “Name, Email, Number”"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <img className="w-[1rem] h-[1.5rem] mt-1 mr-[0.8rem] opacity-50" src={Arrow} alt="" />
              </div>
              <button className="bg-[#4e9c4e] text-white py-3 px-4 flex items-center mr-8 max600:absolute max600:top-[-5%] max600:right-[-5%] max600:p-1 max600:rounded-[7px]" onClick={addCategory}>+ Add Category</button>
            </section>
            <section className="table_body K2D w-[95%] border border-[#2e2e2e] rounded-[6px] overflow-auto bg-[#fffb] my-[0.8rem] mx-auto custom-scrollbar">
              <table className="w-[100%]">
                <thead className="border-b text-[1.1rem] font-[600] border-[#2e2e2e]">
                  <tr>
                    <td>Category name</td>
                    <td>Parent category</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {categories
                    .filter(category =>
                      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (category.parent && category.parent.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(category => (
                      <tr key={category._id} className="">
                        <td>{category.name}</td>
                        <td>{category?.parent?.name || 'None'}</td>
                        <td className="flex gap-2">
                          <button className="btn-default flex h-8" onClick={() => editCategory(category)}>
                            Edit
                          </button>
                          <button className="btn-red flex h-8" onClick={() => deleteCategory(category)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
          </main>
        )}
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));