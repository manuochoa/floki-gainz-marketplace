import Slider from "react-input-slider";
import Cross from "../../../Icons/Cross";
import Select from "../../common/Select";
import check from "../../../images/svg/check.svg";

export default function Sidebar({
  filters,
  setFilters,
  resetFilters,
  setList,
  setRarityList,
  filtersVisible,
  setFiltersVisible,
  rarity,
  setRarity,
}) {
  //   useEffect(() => {
  //     if (items) {
  //       let filteredItems = [];
  //       let values = [];

  //       for (let key in filters) {
  //         if (filters[key]) {
  //           values.push(key);
  //         }
  //       }
  //       console.log(values, items, "filters");
  //       items.map((i) => {
  //         let isIncluded = false;
  //         if (
  //           values.includes(i.metadata.attributes[0].value) &&
  //           values.includes(i.metadata.attributes[1].value)
  //         ) {
  //           isIncluded = true;
  //         }
  //         // i.metadata.attributes.map((x) => {
  //         //   if (values.includes(x.value)) {
  //         //     isIncluded = true;
  //         //   }
  //         // });
  //         if (isIncluded) {
  //           filteredItems.push(i);
  //         }
  //       });
  //       console.log(filteredItems, "filtered");
  //       setFilteredItems(filteredItems);
  //     }
  //   }, [items, filters]);
  return (
    <div
      className={
        "marketplace__column marketplace__column--1 sidebar" +
        (filtersVisible ? " opened" : "")
      }
    >
      <div className="sidebar__row sidebar__row--top">
        <div className="sidebar__title sidebar__title--main">Filters</div>
        <button
          className="sidbar__close close"
          onClick={() => setFiltersVisible(false)}
        ></button>
      </div>
      {/* <h3 className="sidebar__title">Price range</h3>
      <div className="sidebar__slider">
        <Slider
          axis="x"
          x={filters.price}
          xstep={0.5}
          xmax={10}
          onChange={({ x }) => setFilters((state) => ({ ...state, price: x }))}
          styles={{
            track: {
              width: "100%",
              height: "6px",
              backgroundColor: "#EBE0BF",
              borderRadius: "100px",
            },
            thumb: {
              width: "18px",
              height: "18px",
              backgroundColor: "#CB352E",
              border: "3px solid #F9EDCA",
              boxShadow: "unset",
            },
            active: {
              backgroundColor: "#CB352E",
            },
          }}
        />
        <div className="sidebar__slider-price">
          <span>{filters.price} BNB</span>
          <span>10 BNB</span>
        </div>
      </div> */}
      <ul className="sidebar__list">
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Background</h3>
          <Select
            list={filters.Background}
            setList={setList}
            name="Background"
          />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Floki</h3>
          <Select list={filters.Floki} setList={setList} name="Floki" />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Rarity</h3>
          <Select list={rarity} setList={setRarityList} name="rarity" />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Head</h3>
          <Select list={filters.Head} setList={setList} name="Head" />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Eyes</h3>
          <Select list={filters.Eyes} setList={setList} name="Eyes" />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Wristband</h3>
          <Select list={filters.Wristband} setList={setList} name="Wristband" />
        </li>
        <li className="sidebar__item">
          <h3 className="sidebar__title sidebar__title--mb">Mouth</h3>
          <Select list={filters.Mouth} setList={setList} name="Mouth" />
        </li>
      </ul>
      <div className="sidebar__row">
        <button className="sidebar__action" onClick={resetFilters}>
          <Cross className="sidebar__action-icon" />
          <span>Reset filter</span>
        </button>
        <button className="sidebar__action sidebar__action--apply">
          <span>Apply</span>
          <img src={check} alt="apply" className="sidebar__action-icon" />
        </button>
      </div>
    </div>
  );
}
