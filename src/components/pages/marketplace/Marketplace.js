import Stats from "../../Stats";
import Input from "../../common/Input";
import { useState } from "react";
import Select from "../../common/Select";
import Sidebar from "./Sidebar";

import TokenCard from "./TokenCard";
import Filters from "./../../../Icons/Filters";
import { useEffect } from "react";
import { filtersInitialState, filterKeys } from "./filters";

const sortArray = [
  { title: "Newest", selected: true, id: 0 },
  { title: "Oldest", selected: false, id: 1 },
  { title: "High to Low", selected: false, id: 2 },
  { title: "Low to High", selected: false, id: 3 },
];
export default function Marketplace({
  getItems,
  userAddress,
  marketNFTs,
  stats,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    date: sortArray,
    type: [true, false, false],
  });
  const [filteredNFTs, setFilteredNFTs] = useState(marketNFTs);
  const [filters, setFilters] = useState(filtersInitialState);
  const [filtersVisible, setFiltersVisible] = useState(false);

  function resetFilters() {
    setFilters(filtersInitialState);
  }

  function setList({ name, index }) {
    setFilters((state) => ({
      ...state,
      [name]: state[name].map((item, itemIndex) => ({
        ...item,
        selected: itemIndex === index ? true : false,
      })),
    }));
  }

  function selectSortType(index) {
    setSort((state) => ({
      ...state,
      type: state.type.map((item, itemIndex) =>
        index === itemIndex ? true : false
      ),
    }));
  }

  function sortDate(type) {
    let temp = filteredNFTs;
    if (Number(type) === 0) {
      temp.sort((a, b) => b.itemInfo.createdAt - a.itemInfo.createdAt);
    } else if (Number(type) === 1) {
      temp.sort((a, b) => a.itemInfo.createdAt - b.itemInfo.createdAt);
    } else if (Number(type) === 2) {
      temp.sort((a, b) => b.itemInfo.price - a.itemInfo.price);
    } else if (Number(type) === 3) {
      temp.sort((a, b) => a.itemInfo.price - b.itemInfo.price);
    }

    console.log(temp);
    setFilteredNFTs(temp);
  }

  useEffect(() => {
    if (filtersVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = null;
    }
  }, [filtersVisible]);

  useEffect(() => {
    let filteredItems = [];
    let values = {
      Background: [],
      Floki: [],
      Head: [],
      Eyes: [],
      Wristband: [],
      Mouth: [],
      Tattoo: [],
    };

    for (let key in filters) {
      for (let x in filters[key]) {
        if (filters[key][x].selected === true) {
          if (filters[key][x].title === "All") {
            let array = Object.values(filterKeys[key]);
            values[key].push(...array);
          } else {
            values[key].push(filters[key][x].title);
          }
        }
      }
    }

    marketNFTs?.map((el) => {
      let isIncluded = false;
      if (
        values[el.metadata.attributes[0].trait_type].includes(
          el.metadata.attributes[0].value
        ) &&
        values[el.metadata.attributes[1].trait_type].includes(
          el.metadata.attributes[1].value
        ) &&
        values[el.metadata.attributes[2].trait_type].includes(
          el.metadata.attributes[2].value
        ) &&
        values[el.metadata.attributes[3].trait_type].includes(
          el.metadata.attributes[3].value
        ) &&
        values[el.metadata.attributes[4].trait_type].includes(
          el.metadata.attributes[4].value
        ) &&
        values[el.metadata.attributes[5].trait_type].includes(
          el.metadata.attributes[5].value
        )
        // values.includes(el.metadata.attributes[6].value)
      ) {
        isIncluded = true;
      }

      if (isIncluded) {
        filteredItems.push(el);
      }
    });
    setFilteredNFTs(filteredItems);
  }, [filters]);

  useEffect(() => {
    setFilteredNFTs(marketNFTs);
  }, [marketNFTs]);

  return (
    <div className="marketplace">
      <Stats stats={stats} />
      <div className="marketplace__wrapper container">
        <div className="marketplace__header">
          <Input
            className="input-wrapper--search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type your keywords"
            button={true}
          />
          <div className="marketplace__columns marketplace__columns--header">
            <div className="marketplace__column marketplace__column--1">
              <Select
                list={sort.date}
                setList={({ index }) => {
                  sortDate(index);
                  setSort((state) => ({
                    ...state,
                    date: state.date.map((item, itemIndex) => ({
                      ...item,
                      selected: itemIndex === index ? true : false,
                    })),
                  }));
                }}
                className="select--sort"
              />

              <button
                className="marketplace__filters"
                onClick={() => setFiltersVisible(true)}
              >
                <Filters className="marketplace__filters-icon" />
              </button>
            </div>
            <div className="marketplace__column marketplace__column--2">
              <h6 className="marketplace__header-title">
                {filteredNFTs.length} Results
              </h6>
              {/* <div className="marketplace__header-buttons">
                <button
                  className={
                    "marketplace__header-button" +
                    (sort.type[0] ? " active" : "")
                  }
                  onClick={() => selectSortType(0)}
                >
                  For Sale
                </button>
                <button
                  className={
                    "marketplace__header-button" +
                    (sort.type[1] ? " active" : "")
                  }
                  onClick={() => selectSortType(1)}
                >
                  Trades
                </button>
                <button
                  className={
                    "marketplace__header-button" +
                    (sort.type[2] ? " active" : "")
                  }
                  onClick={() => selectSortType(2)}
                >
                  All Tokens
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="marketplace__columns">
          <Sidebar
            filtersVisible={filtersVisible}
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            setList={setList}
            setFiltersVisible={setFiltersVisible}
          />
          <ul className="marketplace__column marketplace__column--2 cards-list cards-list--marketplace">
            {filteredNFTs.map((item, index) => {
              return (
                <li className="cards-list__item" key={index}>
                  <TokenCard item={item} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
