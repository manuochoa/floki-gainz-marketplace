import Slider from 'react-input-slider';
import Cross from '../../../Icons/Cross';
import Select from '../../common/Select';

export default function Sidebar({ filters, setFilters, resetFilters, setList }) {
    return (
        <div className="sidebar">
            <h3 className="sidebar__title">Price range</h3>
            <div className="sidebar__slider">
                <Slider
                    axis="x"
                    x={filters.price}
                    xstep={0.5}
                    xmax={10}
                    onChange={({ x }) => setFilters(state => ({ ...state, price: x }))}
                    styles={{
                        track: {
                            width: "100%",
                            height: "6px",
                            backgroundColor: "#EBE0BF",
                            borderRadius: "100px"
                        },
                        thumb: {
                            width: "18px",
                            height: "18px",
                            backgroundColor: "#CB352E",
                            border: "3px solid #F9EDCA",
                            boxShadow: "unset"
                        },
                        active: {
                            backgroundColor: "#CB352E"
                        }
                    }}
                />
                <div className="sidebar__slider-price">
                    <span>{filters.price} BNB</span>
                    <span>10 BNB</span>
                </div>
            </div>
            <ul className="sidebar__list">
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Background</h3>
                    <Select list={filters.background} setList={setList} name="background" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Floki</h3>
                    <Select list={filters.floki} setList={setList} name="floki" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Rarity</h3>
                    <Select list={filters.rarity} setList={setList} name="rarity" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Head</h3>
                    <Select list={filters.head} setList={setList} name="head" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Eyes</h3>
                    <Select list={filters.eyes} setList={setList} name="eyes" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Wristband</h3>
                    <Select list={filters.wristband} setList={setList} name="wristband" />
                </li>
                <li className="sidebar__item">
                    <h3 className="sidebar__title sidebar__title--mb">Mouth</h3>
                    <Select list={filters.mouth} setList={setList} name="mouth" />
                </li>
            </ul>
            <button className="sidebar__reset" onClick={resetFilters}>
                <Cross className="sidebar__reset-icon" />
                <span>Reset filter</span>
            </button>
        </div>
    )
}
