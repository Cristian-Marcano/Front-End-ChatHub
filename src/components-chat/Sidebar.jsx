//import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src="https://i.pravatar.cc/40"
          alt="Perfil"
          className="avatar"
        />
        <div className="sidebar-actions">
          <button className="icon-button" title="Estados">
            🟢
          </button>
          <button className="icon-button" title="Nuevo chat">
            💬
          </button>
          <button className="icon-button" title="Menú">
            ☰
          </button>
        </div>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Buscar o iniciar un chat"
          className="search-input"
        />
      </div>
      <div className="sidebar-footer">
        {/* Puedes agregar accesos directos o configuraciones aquí */}
      </div>
    </div>
  );
};

export default Sidebar;