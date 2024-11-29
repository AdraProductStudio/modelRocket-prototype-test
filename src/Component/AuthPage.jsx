import React from 'react'
import { Navbar } from './Reusables/Navbar'
import { Link, Outlet, useLocation } from 'react-router-dom'

const AuthPage = () => {
  const location = useLocation();

  let currentLink = '';

  const crumbs = location.pathname.split("/")
    .filter(crumb => crumb !== '')
    .map(crumb => {
      currentLink += `/${crumb}`

      return (
        <li className='breadcrumb-item' key={crumb}>
          {/* {crumb==="jewelry_category" || crumb==="hvac_category" ? <Link to={currentLink} className='text-decoration-none text-dark link-fontWeight'>Category</Link> :null} */}
          {crumb === "consumer_preference" ? <Link to={currentLink} className='text-decoration-none text-dark link-fontWeight'>Consumer Preference</Link> : null}
          {crumb !== "consumer_preference" ? <Link to={currentLink} className='text-decoration-none text-dark link-fontWeight'>{crumb[0].toUpperCase() + crumb.slice(1)}</Link> : null}
        </li>
      )
    })

  const removeLocalStorage = () => {
    localStorage.removeItem("client_id")
    localStorage.removeItem("product_id")
    localStorage.removeItem("service_id")
    localStorage.removeItem("isAdmin")
  }
  return (
    <div className="vh-100">
      <Navbar />

      <div className="content-body-height">
        <div className="h-100">
          <div className="container">


            {
              window.location.pathname !== "/admin" ?
                <div className="content-breadcrumps-height d-flex align-items-end border-dark border-1 border-bottom">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-light p-2 rounded-1 mb-0">
                      <li className="breadcrumb-item">
                        <Link to={"/"} className='text-decoration-none text-dark link-fontWeight' onClick={removeLocalStorage}>Home</Link>
                      </li>
                      {crumbs}
                    </ol>
                  </nav>
                </div>

                :
                null
            }

            <Outlet />

          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage