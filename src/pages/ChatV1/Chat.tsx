import "./Chat.css";
import Chatting from "../ChatV1/component/chat/Chatting";
import Detail from "../ChatV1/component/detail/Detail"
import List from "../ChatV1/component/list/List"
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from '@mui/material';


const Chat = () => {
    return (
        <div className="background">
            <AppBar position="sticky" style={{ top: 0 }}>
                <Box width='100%' sx={{ backgroundColor: 'white' }}>
                    <Toolbar disableGutters>
                        <Link href="/"><img src="../../../public/Logo.png" alt="Logo" style={{ height: '70px', marginLeft: '20px' }} /></Link>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '40%' }}>
                            <Button href='/for-owner' variant="text" sx={{ color: ' #00aeeb', fontWeight: 'bold' }}>Dành cho chủ phòng khám</Button>
                            <Button variant='text' sx={{ color: ' #00aeeb', fontWeight: 'bold' }}>Tư vấn trực tuyến</Button>
                            <Button href='/login' variant='contained' sx={{ color: 'white', borderRadius: '5px' }}>Đăng nhập</Button>
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <div className="container">

                <List />
                <Chatting />
                <Detail />
            </div>
        </div>

    )

}

export default Chat