<template>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1 class="company">Smart Inventory Core</h1>
                <p class="badge">Prueba Técnica</p>
            </div>

            <div class="content">
                <h2>Gestión de Inventario en Tiempo Real</h2>
                <p class="description">MVP para controlar bodega y alertar cuando el stock es crítico</p>
            </div>

            <Button label="Iniciar Sesión" @click="$router.push('/app/products')" color="primary" padding="10px" size="md" :outline="false" />

            <div class="footer">
                <p>Jhonatan Steven García Gómez</p>
                <p>Adso</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import Button from "../components/button.vue"
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
}

.card {
    background: white;
    padding: 50px 40px;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 550px;
    text-align: center;
}

.header {
    margin-bottom: 20px;
}

.company {
    margin: 0;
    font-size: 40px;
    font-weight: 700;
}

.badge {
    margin: 5px 0 0 0;
    display: inline-block;
    background: #f0f0f0;
    color: #667eea;
    padding: 8px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.content {
    margin-bottom: 40px;
}

.content h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 28px;
}

.description {
    margin: 0;
    color: #666;
    font-size: 16px;
    line-height: 1.6;
}

.btn-start {
    padding: 14px 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 30px;
    width: 100%;
}

.btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-start:active {
    transform: translateY(0);
}

.footer {
    border-top: 1px solid #eee;
    margin-top: 20px;
    padding-top: 20px;
}

.footer p{
    margin: 0;
    color: #999;
    font-size: 14px;
}
</style>
