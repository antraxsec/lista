const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: '50.6.160.90',
    user: 'antraxse_admin',
    password: 'I5+os]rQ=?s&',
    database: 'antraxse_pos5'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
/**
 **rotas de producto
 */
// Obtener todos los ítems
app.get('/api/items', (req, res) => {
    const query = `
        SELECT 
            c.id as category_id, 
            c.code as category_code, 
            c.name as category_name, 
            c.created_at as category_created_at, 
            c.updated_at as category_updated_at, 
            c.deleted_at as category_deleted_at,
            p.id as product_id,
            p.type as product_type,
            p.code as product_code,
            p.Type_barcode as product_barcode_type,
            p.name as product_name,
            p.cost as product_cost,
            p.price as product_price,
            p.brand_id as product_brand_id,
            p.unit_id as product_unit_id,
            p.unit_sale_id as product_unit_sale_id,
            p.unit_purchase_id as product_unit_purchase_id,
            p.TaxNet as product_tax_net,
            p.tax_method as product_tax_method,
            p.image as product_image,
            p.note as product_note,
            p.stock_alert as product_stock_alert,
            p.is_variant as product_is_variant,
            p.is_imei as product_is_imei,
            p.not_selling as product_not_selling,
            p.is_active as product_is_active,
            p.created_at as product_created_at,
            p.updated_at as product_updated_at,
            p.deleted_at as product_deleted_at
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }

        // Transformar los resultados para agrupar productos bajo sus respectivas categorías
        const categories = {};
        results.forEach(row => {
            if (!categories[row.category_id]) {
                categories[row.category_id] = {
                    id: row.category_id,
                    code: row.category_code,
                    name: row.category_name,
                    created_at: row.category_created_at,
                    updated_at: row.category_updated_at,
                    deleted_at: row.category_deleted_at,
                    products: []
                };
            }
            if (row.product_id) {
                categories[row.category_id].products.push({
                    id: row.product_id,
                    type: row.product_type,
                    code: row.product_code,
                    barcode_type: row.product_barcode_type,
                    name: row.product_name,
                    cost: row.product_cost,
                    price: row.product_price,
                    brand_id: row.product_brand_id,
                    unit_id: row.product_unit_id,
                    unit_sale_id: row.product_unit_sale_id,
                    unit_purchase_id: row.product_unit_purchase_id,
                    tax_net: row.product_tax_net,
                    tax_method: row.product_tax_method,
                    image: row.product_image,
                    note: row.product_note,
                    stock_alert: row.product_stock_alert,
                    is_variant: row.product_is_variant,
                    is_imei: row.product_is_imei,
                    not_selling: row.product_not_selling,
                    is_active: row.product_is_active,
                    created_at: row.product_created_at,
                    updated_at: row.product_updated_at,
                    deleted_at: row.product_deleted_at
                });
            }
        });

        res.status(200).json(Object.values(categories));
    });
});


//*end rutas

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
