package com.angularShop.angularShop.models

import javax.persistence.*

@Entity
@Table(name="Makers")
data class Maker(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var name: String
)