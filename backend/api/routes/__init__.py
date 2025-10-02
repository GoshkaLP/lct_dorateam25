from api.routes import itp, itp_fitlers, mkd

routers = [
    itp.router,
    itp_fitlers.router,
    mkd.router,
]
