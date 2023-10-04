import React, { useState } from "react";
import styles from "./categories.module.scss";
import plus from "../../images/plus.png";
import orangeCross from "../../images/orange cross.png";
import tick from "../../images/tick.png";
import edit from "../../images/something.png";
import redCross from "../../images/red cross.png";
import SubCategory from "./SubCategory";
import { vars, categoriesInterface } from "./types";
import Popup from "../Popup";

function findCategoryById(
  root: categoriesInterface,
  idToFind: number
): categoriesInterface | undefined {
  if (root.id === idToFind) {
    return root;
  }

  if (root.subCategories) {
    for (const subCategory of root.subCategories) {
      const result = findCategoryById(subCategory, idToFind);
      if (result) {
        return result;
      }
    }
  }

  return undefined;
}

interface CategoriesProps {
  categories: categoriesInterface[];
  setCategories: (value: categoriesInterface[]) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  setCategories,
}) => {
  const [id, setId] = useState<number>(0);
  const [displayPopup, setDisplayPopup] = useState<boolean | number>(false);
  const [colors, setColors] = useState<string[]>([
    "#f96",
    "#18b2d5",
    "#b3bdc6",
  ]);

  const addCategory = (): void => {
    const copyCategories: categoriesInterface[] = [...categories];
    copyCategories.push({
      type: vars.input,
      name: "",
      id,
      parent: null,
      subCategories: [],
    });

    setId(id + 1);
    setCategories(copyCategories);
  };

  const changeCategoryName = (id: number, value: string): void => {
    const copyCategories: categoriesInterface[] = [...categories].map(
      (category) => {
        if (category.id === id) category.name = value;
        return category;
      }
    );

    setCategories(copyCategories);
  };

  const removeCategory = (id: number): void => {
    const copyCategories: categoriesInterface[] = [...categories].filter(
      (el) => el.id !== id
    );

    setCategories(copyCategories);
  };

  const changeType = (id: number): void => {
    const copyCategories: categoriesInterface[] = [...categories].map(
      (category) => {
        if (category.id === id) {
          if (category.type === vars.input) {
            category.type = vars.ultimate;
          } else {
            category.type = vars.input;
          }
        }

        return category;
      }
    );

    setCategories(copyCategories);
  };

  const changeSubCategoryName = (_id: number, value: string): void => {
    const copyCategories: categoriesInterface[] = [...categories];
    let parent: categoriesInterface | undefined = undefined;

    copyCategories.forEach((category) => {
      if (findCategoryById(category, _id)) {
        parent = findCategoryById(category, _id);
        if (parent) {
          parent.name = value;
        }
      }
    });

    setCategories(copyCategories);
  };

  const removeSubCategory = (_id: number, _parent: number | null): void => {
    const copyCategories: categoriesInterface[] = [...categories];
    let parent: categoriesInterface | undefined = undefined;

    if (_parent) {
      copyCategories.forEach((category) => {
        if (findCategoryById(category, _parent)) {
          parent = findCategoryById(category, _parent);
          if (parent) {
            // eslint-disable-next-line no-delete-var
            parent.subCategories = parent.subCategories.filter(
              (el) => el.id !== _id
            );
          }
        }
      });
    }

    setCategories(copyCategories);
  };

  const changeSybCategoryType = (_id: number): void => {
    const copyCategories: categoriesInterface[] = [...categories];
    let parent: categoriesInterface | undefined = undefined;

    copyCategories.forEach((category) => {
      if (findCategoryById(category, _id)) {
        parent = findCategoryById(category, _id);
        if (parent) {
          if (parent.type === vars.input) {
            parent.type = vars.ultimate;
          } else if (parent.type === vars.ultimate) {
            parent.type = vars.input;
          }
        }
      }
    });

    setCategories(copyCategories);
  };

  const addSubCategory = (_id: number): void => {
    const copyCategories: categoriesInterface[] = [...categories];

    let parent: categoriesInterface | undefined = undefined;

    copyCategories.forEach((category) => {
      if (findCategoryById(category, _id)) {
        parent = findCategoryById(category, _id);
        if (parent) {
          parent.subCategories = [
            ...parent.subCategories,
            {
              type: vars.input,
              name: "",
              id,
              parent: _id,
              subCategories: [],
            },
          ];
        }
      }
    });

    setId(id + 1);
    setCategories(copyCategories);
  };

  return (
    <div className={styles.topWrapper}>
      <div className={styles.categoriesWrapper}>
        <p className={styles.text}>Categories</p>
        <button className={styles.add} onClick={addCategory}>
          <img src={plus} alt="add" />
        </button>
      </div>

      <div className={styles.categories}>
        {categories.map((category: categoriesInterface, index) => {
          if (category.type === vars.input) {
            return (
              <div key={category.id} className={styles.subCategoriesWrapper}>
                <div className={styles.categoryWrapper}>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={category.name}
                    className={styles.input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      changeCategoryName(category.id, e.target.value)
                    }
                  />{" "}
                  <button
                    className={styles.add}
                    onClick={() => removeCategory(category.id)}
                  >
                    <img src={orangeCross} alt="remove" />
                  </button>
                  <button
                    className={styles.add}
                    onClick={() => changeType(category.id)}
                  >
                    <img src={tick} alt="ok" />
                  </button>
                </div>
                {category.subCategories?.length ? (
                  <div className={styles.categories}>
                    {category.subCategories.map(
                      (category: categoriesInterface, index) => (
                        <SubCategory
                          subCategories={category.subCategories}
                          changeSubCategoryName={changeSubCategoryName}
                          removeSubCategory={removeSubCategory}
                          changeSybCategoryType={changeSybCategoryType}
                          addSubCategory={addSubCategory}
                          categories={categories}
                          lastId={id}
                          colors={colors}
                          setColors={setColors}
                        />
                      )
                    )}
                  </div>
                ) : null}
              </div>
            );
          } else {
            return (
              <div key={category.id} className={styles.subCategoriesWrapper}>
                <div className={styles.categoryWrapper}>
                  <p className={styles.categoryName}>{category.name}</p>
                  <button
                    className={styles.add}
                    onClick={() =>
                      category.subCategories.length
                        ? addSubCategory(category.id)
                        : setDisplayPopup(category.id)
                    }
                  >
                    <img src={plus} alt="add" />
                  </button>
                  <button
                    className={styles.add}
                    onClick={() => changeType(category.id)}
                  >
                    <img src={edit} alt="edit" />
                  </button>

                  <button
                    className={styles.add}
                    onClick={() => removeCategory(category.id)}
                  >
                    <img src={redCross} alt="remove" />
                  </button>
                </div>

                {category.subCategories?.length ? (
                  <div className={styles.categories}>
                    <SubCategory
                      subCategories={category.subCategories}
                      changeSubCategoryName={changeSubCategoryName}
                      removeSubCategory={removeSubCategory}
                      changeSybCategoryType={changeSybCategoryType}
                      addSubCategory={addSubCategory}
                      categories={categories}
                      lastId={id}
                      colors={colors}
                      setColors={setColors}
                    />
                  </div>
                ) : null}
                {displayPopup === category.id && (
                  <Popup
                    onCategoryClick={() => {
                      addSubCategory(category.id);
                      setDisplayPopup(false);
                    }}
                  />
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Categories;
