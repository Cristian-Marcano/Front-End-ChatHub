import './App.css'

function App() {
  return (
    <div class="wrapper">
      <div class="card-switch">
        <label class="switch">
          <input type="checkbox" class="toggle"/>
          <span class="slider"></span>
          <span class="card-side"></span>
            <div class="flip-card__inner">
              <div class="flip-card__front">
                <div class="title">Iniciar Sesion</div>
                <form class="flip-card__form" action="">
                  <input class="flip-card__input" name="email" placeholder="Correo" type="email"/>
                  <input class="flip-card__input" name="password" placeholder="Contraseña" type="password"/>
                  <button class="flip-card__btn">Iniciar</button>
                </form>
              </div>
              <div class="flip-card__back">
                <div class="title">Registrarse</div>
                <form class="flip-card__form" action="">
                  <input class="flip-card__input" placeholder="Name" type="name"/>
                  <input class="flip-card__input" name="email" placeholder="Email" type="email"/>
                  <input class="flip-card__input" name="password" placeholder="Password" type="password"></input>
                  <button class="flip-card__btn">Confirmar</button>
                </form>
              </div>
            </div>
        </label>
      </div>
    </div>
  ) 
}

export default App
