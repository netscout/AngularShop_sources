# Generated by Django 3.0.7 on 2020-06-15 00:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('parent', models.ForeignKey(blank=True, db_column='parentId', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='shop.Category')),
            ],
            options={
                'db_table': 'Categories',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='ProductCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sort_order', models.IntegerField(blank=True, db_column='sortOrder', default=1)),
                ('category', models.ForeignKey(db_column='categoryId', on_delete=django.db.models.deletion.CASCADE, related_name='products', to='shop.Category')),
                ('product', models.ForeignKey(db_column='productId', on_delete=django.db.models.deletion.CASCADE, related_name='categories', to='shop.Product')),
            ],
            options={
                'db_table': 'ProductCategories',
                'ordering': ['id'],
            },
        ),
    ]