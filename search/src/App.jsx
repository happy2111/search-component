import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [inpValue, setInpValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isTableVisible, setTableVisible] = useState(false);
  const containerRef = useRef(null);

  const url = `https://onetec.pythonanywhere.com/articles/?search=${inpValue}`;

  const fetchAsync = async () => {
    if (inpValue.trim() === "") {
      setSearchData([]);
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Ошибка при загрузке данных");
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Отслеживаем изменения inpValue
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAsync();
    }, 300);
    return () => clearTimeout(timeout);
  }, [inpValue]);

  const handleChange = (value) => {
    setInpValue(value);
  };
  // end 


  // Скрытие таблицы при клике вне контейнера
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setTableVisible(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleFocus = () => setTableVisible(true);

// focus end






  return (
    <div className="container" ref={containerRef}>
      <input
        value={inpValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        type="text"
        placeholder="Введите запрос"
      />
      <div className="list" style={{ display: isTableVisible ? "block" : "none" }}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {searchData.length > 0 ? (
              searchData.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Нет результатов</td>
              </tr> 
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
